import { Role } from "@prisma/client";
import { prisma } from "./prisma";

type CompositeUser = {
  id: string;
  role: Role | null | undefined;
} & {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export const getAdminPanel = async (user: CompositeUser | undefined) => {
  if (!user) return "";

  if (user.role === "SUPER_ADMIN") return "/admin";

  if (user.role === "GROUP_ADMIN") {
    const groupAdmin = await prisma.groupAdmin.findFirst({
      where: {
        email: user.email!,
      },
      select: {
        allocationGroup: {
          select: { slug: true },
        },
      },
    });
    const group = groupAdmin?.allocationGroup?.slug;
    return `/admin/${group}`;
  }

  if (user.role === "SUB_GROUP_ADMIN") {
    const subGroupAdmin = await prisma.subGroupAdmin.findFirst({
      where: {
        email: user.email!,
      },
      select: {
        allocationSubGroup: {
          select: {
            allocationGroup: {
              select: {
                slug: true,
              },
            },
            slug: true,
          },
        },
      },
    });

    const group = subGroupAdmin?.allocationSubGroup.allocationGroup.slug;
    const subGroup = subGroupAdmin?.allocationSubGroup.slug;
    return `/admin/${group}/${subGroup}`;
  }
  return "";
};

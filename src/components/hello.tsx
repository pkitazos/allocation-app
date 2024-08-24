<Card className={cn("w-full", className)}>
  <CardHeader className="pb-4">
    <CardTitle className="text-xl">User Info</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col justify-evenly gap-4">
      <div className="flex items-center">
        <UserIcon className="mr-2 h-4 w-4 opacity-70" />
        <span className="mr-2 font-semibold">ID:</span>
        {user.id}
      </div>
      <div className="flex items-center">
        <HashIcon className="mr-2 h-4 w-4 opacity-70" />
        <span className="mr-2 font-semibold">Email:</span>
        {user.email}
      </div>
    </div>
  </CardContent>
</Card>;

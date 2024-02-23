import { AES } from "crypto-js";

import { EVALUATORS, to_ID } from "@/lib/db/data";

import { env } from "@/env";

async function main() {
  console.log("------------>> generating\n");

  for (let i = 1; i <= EVALUATORS; i++) {
    const ID = to_ID(i);
    console.log(ID);
    const password = AES.encrypt(ID, env.ID_KEY).toString();

    console.log(password);
  }

  console.log("\n<<------------ done");
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});

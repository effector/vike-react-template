import { useUnit } from "effector-react";
import { Link } from "~/shared/routing";

import { $random } from "../../index/model";
import { $clientId, $id } from "./model";

export function Page() {
  const id = useUnit($id);
  const clientId = useUnit($clientId);
  const random = useUnit($random);

  return (
    <div>
      <h1>Example</h1>
      <p>Read parameter from route: {id}</p>
      <p>
        Client id: {clientId}
        random: {random}
      </p>
      <Link href="/">Go home</Link>
    </div>
  );
}

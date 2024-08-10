import { useUnit } from "effector-react";
import { Link } from "~/shared/routing";

import { $id } from "./model";

export function Page() {
  const id = useUnit($id);

  return (
    <div>
      <h1>Example</h1>
      <p>Read parameter from route: {id}</p>
      <Link href="/">Go home</Link>
    </div>
  );
}

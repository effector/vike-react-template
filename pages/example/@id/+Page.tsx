import { useUnit } from "effector-react";
import { clientOnly } from "vike-react/clientOnly";
import { Link } from "~/shared/routing";

import { $id } from "./model";

const Component = clientOnly(() => import("./ClientComponent"));

export function Page() {
  const id = useUnit($id);

  return (
    <div>
      <h1>Example</h1>
      <p>Read parameter from route: {id}</p>
      <p>
        Client id: <Component fallback="loading..." />
      </p>
      <Link href="/">Go home</Link>
    </div>
  );
}

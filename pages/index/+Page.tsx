import { useUnit } from "effector-react";
import { Link } from "~/shared/routing";

import { $random } from "./model";

export default function PageHome() {
  const random = useUnit($random);

  return (
    <div>
      <h1>Hello World</h1>
      <p>Random from server: {random}</p>
      <Link href={`/example/${random}`}>Go to /example/{random}</Link>
    </div>
  );
}

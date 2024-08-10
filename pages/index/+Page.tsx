import { useUnit } from "effector-react";

import { $random } from "./model";

export default function PageHome() {
  const random = useUnit($random);

  return (
    <div>
      <h1>Hello World</h1>
      <p>Random from server: {random}</p>
    </div>
  );
}

import type React from "react";

import { fork } from "effector";
import { Provider } from "effector-react";
import { usePageContext } from "vike-react/usePageContext";

export default function WrapperEffector({ children }: { children: React.ReactNode }) {
  const { scopeValues } = usePageContext();

  return <Provider value={fork({ values: scopeValues })}>{children}</Provider>;
}

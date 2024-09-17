import type React from "react";
import { useEffect, useRef } from "react";

import { EffectorNext } from "@effector/next";
import { createEvent } from "effector";
import { useUnit } from "effector-react";
import { usePageContext } from "vike-react/usePageContext";

const noop = createEvent();

const Inner = () => {
  const { config } = usePageContext();
  const clientStartedRef = useRef(false);
  const onClientStarted = useUnit(config.pageClientStarted ?? noop);

  useEffect(() => {
    if (!clientStartedRef.current && "pageClientStarted" in config) {
      onClientStarted();
      clientStartedRef.current = true;
    }
  }, []);

  return <></>;
};

export default function WrapperEffector({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();
  const { scopeValues } = pageContext;

  return (
    <EffectorNext values={scopeValues}>
      <Inner />
      {children}
    </EffectorNext>
  );
}

import { useUnit } from "effector-react";

import { $clientId } from "./model";

// Since $clientId changes during client rendering to avoid hydration error we need to make consumer components only client
const ClientComponent = () => {
  const clientId = useUnit($clientId);

  return <>{clientId}</>;
};

export default ClientComponent;

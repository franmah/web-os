export type Processes = {
  [id: string]:  {
    name: string;
    Component: React.ComponentType<{}>;
  };
}
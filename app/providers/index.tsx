"use client";

import { Web3Provider } from "@/app/providers/web3-provider";

const buildProvidersTree = (componentsWithProps: any[]) => {
  const initialComponent = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  return componentsWithProps.reduce(
    (AccumulatedComponents, [Provider, props = {}]) => {
      const ProviderWithProps = ({
        children,
      }: {
        children: React.ReactNode;
      }) => (
        <AccumulatedComponents>
          <Provider {...props}>{children}</Provider>
        </AccumulatedComponents>
      );
      ProviderWithProps.displayName = `ProviderWithProps(${
        Provider.displayName || Provider.name || "Unknown"
      })`;
      return ProviderWithProps;
    },
    initialComponent
  );
};

const ProvidersTree = buildProvidersTree([[Web3Provider]]);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <ProvidersTree>{children}</ProvidersTree>;
};

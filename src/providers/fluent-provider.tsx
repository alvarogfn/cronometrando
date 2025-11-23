import type {PropsWithChildren} from "react";

import { FluentProvider as FluentInternalProvider, webDarkTheme } from '@fluentui/react-components';

type FluentProviderProps = PropsWithChildren

function FluentProvider({children}: FluentProviderProps) {
 return (
   <FluentInternalProvider theme={webDarkTheme}>
     {children}
   </FluentInternalProvider>
  )
 }

export default FluentProvider;

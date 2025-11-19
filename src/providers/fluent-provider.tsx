import { FluentProvider as FluentInternalProvider, webDarkTheme } from '@fluentui/react-components';
import type {PropsWithChildren} from "react";

type FluentProviderProps = PropsWithChildren

function FluentProvider({children}: FluentProviderProps) {
 return (
   <FluentInternalProvider theme={webDarkTheme}>
     {children}
   </FluentInternalProvider>
  )
 }

export default FluentProvider;

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AuthContextProvider, {AuthContext} from '../modules/auth_provider'
import WebSocketProvider from '../modules/websocket_provider'

export default function App({ Component, pageProps }: AppProps) {

  return (
      <>
        <AuthContextProvider>
          <WebSocketProvider>
            <div className='flex flex-col md:flex-row h-full min-h-screen font-sans relative bg-primary text-primary-light'>
                <Component {...pageProps} />
            </div>
          </WebSocketProvider>
        </AuthContextProvider>
      </>
  )
}

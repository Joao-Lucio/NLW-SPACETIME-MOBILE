import { styled } from 'nativewind'
import { ImageBackground } from 'react-native'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripers.svg'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

const StyleStripes = styled(Stripes) // poder customizar o Stripes

export default function Layout() {
  // React monitora a useState, variavel vomeça como null, mas se usuario tiver se tiver logado true
  const [isUserAuthenticated, setIsUserAuthenticate] = useState<null | boolean>(
    null,
  )

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  // Dispara toda vez que a variavel mudar
  // Mas se eu não passo nenhuma variavel dentro [], isso sera executado somente uma vez
  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      setIsUserAuthenticate(!!token) // !! -> converte o token para true se existir
    })
  }, [])

  if (!hasLoadedFonts) return <SplashScreen /> // Enquando a fonte não carregar retorna null

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyleStripes className="absolute left-2" />
      <StatusBar style="light" translucent />
      {/* Stack -> Tipo de navegação do tipo pilha entre tela - headerShow tirar o titulo da pagina */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade', // animação de transição de tela
        }}
      >
        {/* se variavel for true ele redireciona para proxima rota */}
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new" />
      </Stack>
    </ImageBackground>
  )
}

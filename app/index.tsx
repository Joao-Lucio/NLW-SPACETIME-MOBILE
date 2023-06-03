import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import * as SecureStore from 'expo-secure-store'

import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from '../src/lib/api'

// import para utlizar a authentication do github
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/b4a4c9c1cbcbd5546a72',
}

// exportando as fontes
export default function App() {
  const router = useRouter() // que vai redirecionar o usuario para outra tela

  // Redirecionar o usuario para a tela de validação do github
  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'b4a4c9c1cbcbd5546a72',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  // ira registrar usuario no banco, passando o code que o git retornou
  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })

    const { token } = response.data // guandará o token que será retornado na response

    await SecureStore.setItemAsync('token', token) // salvando o token na SecureStore para ser utilizado para identificar o usuario logado

    router.push('/memories') // redireciona usuario para a segunda tela
  }

  // fica monitorando elemento
  useEffect(() => {
    // quando response retornar sucesso ele salva o code
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code) // mando o code para ser criado o usuario
    }
  }, [response])

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()} // signInWithGithub() -> função para logar usuario
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar Lembraça
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}

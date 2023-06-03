import { ScrollView, Switch, Text, TextInput, View, Image } from 'react-native'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api'

// Segunda tela
export default function NewMemories() {
  const { bottom, top } = useSafeAreaInsets() // variavel que irá guardar quando de margem bottom e top seria ideal dá
  const router = useRouter()
  const [isPublic, setIsPublic] = useState(false) // variavel para verificar se o switch está ativo
  const [content, setContent] = useState('') // variavel que ira guardar o texto da memory, setContent que vai atualizar o content
  const [preview, setPreview] = useState<string | null>(null) // preview que ira guardar o endereço da imagem

  // Funcão para abrir galeria e selecionar imagem
  async function openImagePicker() {
    try {
      // result vai guardar as informações da imagem que sera selecionada
      const result = await ImagePicker.launchImageLibraryAsync({
        // abrir galeria
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // carregar somente imagem
        quality: 1,
      }) // aspect: [4, 3], allowsEditing: true,

      // Se existir imagem o preview é atualizado com a uri da imagem
      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (err) {
      console.log('Erro ao carregar imagem')
    }
  }
  async function handleCreateMemory() {
    // Pego o token
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    // Se tiver preview
    if (preview) {
      const uploadFormData = new FormData() // variavel que irá receber o fomulario

      // Passo a preview da imagem, dou um nome e um tipo, foi definidos ele somente para poder enviar no banco é alterado
      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any)

      // Imagem é enviada e o uploadResponse irá guardar a resposta da requisição
      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          // espercifico para o android passar esse header
          'Content-Type': 'multipart/form-data',
        },
      })

      // cover vai receber a url da imagem que foi enviada para o back
      coverUrl = uploadResponse.data.fileUrl
    }

    // Salvo a memoria, passando o content, isPublic e o coverUrl
    await api.post(
      '/memories',
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/memories')
  }
  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />
        {/* asChild -> todos dentro do link tem o comportamento dele */}
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Div do Switch */}
      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#767577', true: '#372560' }}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>
        {/* Componentes para salvar as fotos ou videos */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openImagePicker}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {/* Se existir preview então exibi a imagem se não exibi a div logo abaixo */}
          {preview ? (
            // eslint-disable-next-line
            <Image
              source={{ uri: preview }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre"
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCreateMemory}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

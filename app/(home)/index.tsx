import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { maybeCompleteAuthSession, openBrowserAsync } from 'expo-web-browser'
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native'

maybeCompleteAuthSession();

interface event {
  url: string
}

const handleDeepLink = (event: event) => {
  const router = useRouter()
  const url = event.url;
  console.log('Deep link recebido:', url);

  // Aqui você pode extrair parâmetros do URL e navegar dentro do app
  if (url.includes('oauth')) {
    // Faça a navegação para a tela desejada
    router.replace('/(home)')
    console.log('Usuário autenticado com sucesso!');
  }
};

export default function Page() {
  const { user } = useUser()

  const openLink = async () => {
    await openBrowserAsync('https://pleasing-sculpin-37.accounts.dev/sign-in')
  }

  React.useEffect(() => {
    // Adiciona um listener para capturar deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Captura deep link caso o app já esteja aberto
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Remove o listener ao desmontar o componente
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <TouchableOpacity onPress={openLink}>
          <Text>Sign in</Text>
        </TouchableOpacity>
        <Link href="https://pleasing-sculpin-37.accounts.dev/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}
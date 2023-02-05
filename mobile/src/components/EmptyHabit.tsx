import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';

export function EmptyHabit() {
    const { navigate } = useNavigation();

    return (
        <View>
            <Text className="text-zinc-400 text-base text-center">
                Voce ainda não tem nenhum hábito {' '}


            </Text>
            <Text
                className="text-violet-400 text-base text-center underline active:text-violet-500"
                onPress={() => navigate('NewHabit')}
            >
                Crie um hábito
            </Text>
        </View>
    );
}
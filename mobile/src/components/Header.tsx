import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import LogoSvg from '../assets/logo.svg';

export function Header() {
    const { navigate } = useNavigation();

    return (
        <View className="w-full flex-row items-center justify-between px-2">
            <LogoSvg/>

            <TouchableOpacity
                activeOpacity={.7}
                className="flex-row h-11 px-4 border border-violet-500 rounded-lg items-center"
                onPress={() => navigate('NewHabit')}
            >
                <Feather name="plus" color={colors.violet[500]} size={20}/>
                <Text className="text-white ml-3 font-semibold text-base">Novo</Text>
            </TouchableOpacity>
        </View>
    );
}
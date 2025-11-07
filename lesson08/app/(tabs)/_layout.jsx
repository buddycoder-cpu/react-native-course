import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF'
                ,
                tabBarStyle: {
                    backgroundColor: '#fff'
                    ,
                },
            }}
        >
            <Tabs.Screen
                name=
                "index"
                options={{
                    title: 'Journal'
                    ,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name=
                            "book" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name=
                "settings"
                options={{
                    title: 'Settings'
                    ,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name=
                            "settings" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
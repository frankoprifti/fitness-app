import axios from 'axios';
import { encode as btoa } from 'base-64';
import * as FileSystem from 'expo-file-system';

const cacheDir = FileSystem.cacheDirectory + 'images/';

export const getImageUrl = async (url: string): Promise<string | null> => {
    const fileName = `${btoa(url)}.jpg`;
    const filePath = cacheDir + fileName;

    try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);

        if (fileInfo.exists) {
            return filePath;
        } else {
            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
                },
                responseType: 'arraybuffer',
            });

            const base64Data = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
            await FileSystem.writeAsStringAsync(filePath, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });

            return filePath;
        }
    } catch (error) {
        console.error("Failed to fetch image:", error);
        return null;
    }
};

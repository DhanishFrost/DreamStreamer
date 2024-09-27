import { fetchAuthSession } from 'aws-amplify/auth';

async function getJWTToken() {
    try {
        const session = await fetchAuthSession();

        // Check if the session or tokens are undefined
        if (!session || !session.tokens || !session.tokens.idToken) {
            console.log('No session or tokens found');
            return null;
        }

        return session.tokens.idToken;
    } catch (error) {
        console.error('Error fetching session:', error);
        return null;
    }
}

export default getJWTToken;

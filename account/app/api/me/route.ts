import {getChatGPTUser} from '../../chatgpt-auth';
import {json} from '../../../lib/progress-service';
export const dynamic='force-dynamic';
export async function GET(){const user=await getChatGPTUser();return user?json({displayName:user.displayName}):json({error:'Sign in required'},401)}

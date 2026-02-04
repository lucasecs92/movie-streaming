import supabase from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // 1. Pega o token enviado no cabeçalho (header) da requisição
  const authHeader = request.headers.get('authorization');

  // 2. Verifica se o token é igual ao que você salvou no .env
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    // 3. Se estiver ok, faz a consulta no Supabase
    // Pode usar qualquer tabela sua aqui, ex: 'profiles'
    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (error) throw error;

    return NextResponse.json({ status: 'success', message: 'Supabase acordado!' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
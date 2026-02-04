import supabase from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');

  // 1. Verifica a segurança
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    // 2. Tenta uma operação no banco para gerar atividade
    // Se você não tiver uma tabela chamada 'profiles', 
    // substitua por qualquer uma que você tenha no Supabase.
    const { error } = await supabase
      .from('profiles') // <--- Troque pelo nome de uma tabela sua se necessário
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase acordado!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
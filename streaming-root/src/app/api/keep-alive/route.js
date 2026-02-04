import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    // Vamos fazer uma query que não depende de nenhuma tabela específica
    // Isso apenas testa se a conexão com o Supabase está viva
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.error("Erro no Supabase:", error.message);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Conexão com Supabase ativa!',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
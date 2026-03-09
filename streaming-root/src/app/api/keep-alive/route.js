import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isAuthorized(request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) return true;

  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY?.trim();

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { status: 'error', message: 'Variáveis do Supabase não configuradas.' },
        { status: 500 }
      );
    }

    const healthcheckUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/`;
    const supabaseResponse = await fetch(healthcheckUrl, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
        authorization: `Bearer ${supabaseAnonKey}`,
      },
      cache: 'no-store',
    });

    if (!supabaseResponse.ok) {
      const errorBody = await supabaseResponse.text();
      console.error('Erro no keep-alive Supabase:', errorBody);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Falha ao manter conexão ativa com o Supabase.',
          details: errorBody.slice(0, 300),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Keep-alive do Supabase executado com sucesso!',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro interno no keep-alive:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
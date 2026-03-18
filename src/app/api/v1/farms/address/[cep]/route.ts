import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

interface ViaCepResponse {
  cep:         string;
  logradouro:  string;
  bairro:      string;
  localidade:  string;
  uf:          string;
  erro?:       boolean;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ cep: string }> },
): Promise<NextResponse> {
  const { cep } = await params;
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return NextResponse.json({ error: 'CEP inválido' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Falha ao consultar CEP' }, { status: 502 });
    }

    const data = await res.json() as ViaCepResponse;

    if (data.erro) {
      return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      address:      data.logradouro ?? null,
      neighborhood: data.bairro     ?? null,
      city:         data.localidade ?? null,
      state:        data.uf         ?? null,
    });
  } catch (err) {
    logger.error('[Address] Failed to fetch CEP', { cep: cleanCep, err });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

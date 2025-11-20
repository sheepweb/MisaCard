import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ card_id: string }> }
) {
  try {
    const { card_id } = await params;

    // 验证 card_id
    if (!card_id) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    // 转发请求到真实的 mujicard.com API
    const response = await fetch(
      `https://api.misacard.com/api/card/${card_id}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': 'Bearer nuceeDqN@UHDHWcpxTcMzj$pDDPrQSd^Q6EY^@$xqNZyRntxu1bmr2qGnJKuFf%&',
          'origin': 'https://misacard.com',
          'referer': 'https://misacard.com/',
        },
      }
    );

    // 获取响应数据
    const data = await response.json();

    // 返回数据给前端
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card information' },
      { status: 500 }
    );
  }
}

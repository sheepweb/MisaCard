'use client';

import { useState, useCallback } from 'react';
import { ApiResponse } from './types';
import CardInfoDisplay from './components/CardInfoDisplay';
import CardInfoSkeleton from './components/CardInfoSkeleton';
import { logger, handleError, isCardUnactivated } from './utils/helpers';

export default function Home() {
  const [cardId, setCardId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [cardData, setCardData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 激活卡片
  const activateCard = useCallback(async (id: string) => {
    setActivating(true);
    setError(null);

    try {
      logger.info(`正在激活卡片: ${id}`);

      const response = await fetch(`/api/card/${id}/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || '激活失败');
      }

      // 激活 API 响应中已包含完整卡片信息，无需重新查询
      setCardData(data);
      logger.info('激活成功，卡片信息已更新');
    } catch (err) {
      setError(handleError(err, '激活失败', '激活错误'));
    } finally {
      setActivating(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardId.trim()) {
      setError('请输入卡片ID');
      return;
    }

    setLoading(true);
    setError(null);
    setCardData(null);

    try {
      const response = await fetch(`/api/card/${cardId.trim()}`);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '获取卡片信息失败');
      }

      setCardData(data);

      // 检查是否需要自动激活
      if (isCardUnactivated(data.result)) {
        logger.info('检测到未激活卡片，开始自动激活...');
        // 使用 setTimeout 确保 UI 先更新显示卡片信息
        setTimeout(() => {
          activateCard(cardId.trim());
        }, 100);
      }
    } catch (err) {
      setError(handleError(err, '获取卡片信息失败'));
    } finally {
      setLoading(false);
    }
  }, [cardId, activateCard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              激活卡片 & 交易记录查询
            </h1>
          </div>

          {/* 查询表单 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                id="cardId"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                placeholder="请输入卡号或卡密"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-white text-gray-900
                         placeholder-gray-400
                         transition-all duration-200"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || activating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium
                         px-6 py-2.5 rounded-lg transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         whitespace-nowrap"
              >
                {loading ? '查询中...' : activating ? '激活中...' : '获取卡信息'}
              </button>
            </form>

            {/* 错误提示 */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* 激活状态提示 */}
            {activating && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <p className="text-blue-600 text-sm font-medium">正在激活卡片...</p>
                </div>
              </div>
            )}
          </div>

          {/* 卡片信息展示 */}
          {loading && <CardInfoSkeleton />}
          {!loading && cardData && <CardInfoDisplay data={cardData} />}
        </div>
      </div>
    </div>
  );
}

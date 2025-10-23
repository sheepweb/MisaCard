'use client';

import { useState, useCallback, memo } from 'react';
import { ApiResponse } from '../types';

interface CardInfoDisplayProps {
  data: ApiResponse;
}

// 样式常量
const FIELD_VALUE_CLASS = "font-mono text-gray-900 bg-blue-50 px-2 py-1 rounded";
const FIELD_LABEL_CLASS = "text-sm text-gray-600 mb-2";

// 复制按钮组件 - 提取到外部避免重新创建
interface CopyButtonProps {
  text: string;
  label: string;
  copySuccess: string | null;
  onCopy: (text: string, label: string) => void;
}

const CopyButton = memo(({ text, label, copySuccess, onCopy }: CopyButtonProps) => {
  const isSuccess = copySuccess === label;

  return (
    <button
      onClick={() => onCopy(text, label)}
      className="ml-2 p-1 text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center justify-center"
      title="复制"
      style={{ width: '24px', height: '24px' }} // 固定尺寸避免布局偏移
    >
      {isSuccess ? (
        <span className="text-green-600 text-xs font-bold">✓</span>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
});

CopyButton.displayName = 'CopyButton';

function CardInfoDisplay({ data }: CardInfoDisplayProps) {
  const { result, error } = data;
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  // 如果有错误信息
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fadeIn">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  // 如果没有结果
  if (!result) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
      {/* 卡片信息内容 */}
      <div className="p-6">
        {/* 卡密 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={FIELD_LABEL_CLASS}>卡密</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                额度: {result.card_limit}
              </span>
              {result.status === '已删除' && (
                <span className="text-red-500 text-sm">
                  已删除
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className={`${FIELD_VALUE_CLASS} text-sm break-all`}>
              {result.id}
            </span>
            <CopyButton text={result.id} label="卡密" copySuccess={copySuccess} onCopy={handleCopy} />
          </div>
        </div>

        {/* 卡号 */}
        <div className="mb-4">
          <div className={FIELD_LABEL_CLASS}>卡号</div>
          <div className="flex items-center">
            <span className={FIELD_VALUE_CLASS}>
              {result.card_number ?? '暂无'}
            </span>
            <CopyButton text={result.card_number?.toString() || ''} label="卡号" copySuccess={copySuccess} onCopy={handleCopy} />
          </div>
        </div>

        {/* 有效期 */}
        <div className="mb-4">
          <div className={FIELD_LABEL_CLASS}>有效期</div>
          <div className="flex items-center">
            <span className={FIELD_VALUE_CLASS}>
              {result.card_exp_date ?? '暂无'}
            </span>
            <CopyButton text={result.card_exp_date || ''} label="有效期" copySuccess={copySuccess} onCopy={handleCopy} />
          </div>
        </div>

        {/* CVC */}
        <div className="mb-4">
          <div className={FIELD_LABEL_CLASS}>CVC</div>
          <div className="flex items-center">
            <span className={FIELD_VALUE_CLASS}>
              {result.card_cvc ?? '暂无'}
            </span>
            <CopyButton text={result.card_cvc || ''} label="CVC" copySuccess={copySuccess} onCopy={handleCopy} />
          </div>
        </div>

        {/* 到期时间 */}
        <div className="mb-4">
          <div className={FIELD_LABEL_CLASS}>到期时间</div>
          <div className="text-gray-900">
            {new Date(result.delete_date || result.create_time).toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </div>
        </div>

        {/* 账单地址 */}
        <div className="mb-4">
          <div className={FIELD_LABEL_CLASS}>账单地址</div>
          <div className="flex items-center">
            <span className={FIELD_VALUE_CLASS}>
              {result.billing_address || '131 Lupine Drive, Torrington, WY 82240'}
            </span>
            <CopyButton
              text={result.billing_address || '131 Lupine Drive, Torrington, WY 82240'}
              label="地址"
              copySuccess={copySuccess}
              onCopy={handleCopy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CardInfoDisplay);

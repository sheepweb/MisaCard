/**
 * 工具函数集合
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * 日志工具 - 开发环境显示详细日志，生产环境只显示错误
 */
export const logger = {
  info: (msg: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`[Frontend] ${msg}`, ...args);
    }
  },
  error: (msg: string, ...args: unknown[]) => {
    console.error(`[Frontend] ${msg}`, ...args);
  },
};

/**
 * 统一错误处理
 * @param err - 错误对象
 * @param defaultMsg - 默认错误消息
 * @param logPrefix - 日志前缀（可选）
 * @returns 错误消息字符串
 */
export function handleError(
  err: unknown,
  defaultMsg: string,
  logPrefix?: string
): string {
  const errorMsg = err instanceof Error ? err.message : defaultMsg;
  
  if (logPrefix) {
    logger.error(`${logPrefix}:`, errorMsg);
  }
  
  return errorMsg;
}

/**
 * 检查卡片是否未激活
 * @param result - 卡片信息
 * @returns 是否未激活
 */
export function isCardUnactivated(result: {
  card_number: number | null;
  card_cvc: string | null;
  card_exp_date: string | null;
} | null): boolean {
  return (
    result !== null &&
    result.card_number === null &&
    result.card_cvc === null &&
    result.card_exp_date === null
  );
}


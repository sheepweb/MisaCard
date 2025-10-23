// 骨架屏字段配置
const skeletonFields = [
  { label: 'w-12', value: 'w-full', isFirst: true },  // 卡密
  { label: 'w-12', value: 'w-48' },                   // 卡号
  { label: 'w-12', value: 'w-20' },                   // 有效期
  { label: 'w-12', value: 'w-16' },                   // CVC
  { label: 'w-16', value: 'w-56' },                   // 到期时间
  { label: 'w-16', value: 'w-64' },                   // 账单地址
];

export default function CardInfoSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="p-6">
        {skeletonFields.map((field, index) => (
          <div key={index} className={field.isFirst ? 'mb-6' : 'mb-4'}>
            {field.isFirst && (
              <div className="flex items-center justify-between mb-2">
                <div className={`h-4 ${field.label} bg-gray-200 rounded`}></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
            )}
            {!field.isFirst && (
              <div className={`h-4 ${field.label} bg-gray-200 rounded mb-2`}></div>
            )}
            <div className={`h-5 ${field.value} bg-gray-200 rounded`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}


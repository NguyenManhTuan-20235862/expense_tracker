import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from 'recharts';


const CustomBarChart = ({ data }) => {

    // Function to alternate colors
    const getBarColor = (index) => {
        return index % 2 === 0 ? '#875cf5' : '#cfbefb';
    }; // Nếu dùng return trong comment ở cuối thì bỏ hàm này

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className='text-xs font-semibold text-purple-800 mb-1'>
                        {payload[0].payload.category}
                    </p>
                    <p className='text-sm text-gray-600'>
                        Số tiền:{" "}
                        <span className='text-sm font-medium text-gray-900'>
                            ${payload[0].payload.amount}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

  return (
    <div className='bg-white mt-6'>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid stroke="none" />

                <XAxis dataKey="month" tick={{fontSize: 12, fill: '#555'}} stroke="none" />
                <YAxis tick={{fontSize: 12, fill: '#555'}} stroke="none" />

                <Tooltip content={CustomTooltip} />

                <Bar
                    dataKey="amount"
                    fill="#FF8042"
                    radius={[10, 10, 0, 0]}
                    activeDot={{r: 8, fill: 'yellow'}}
                    activeStyle={{fill: "green"}}
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={getBarColor(index)} />
                    ))};
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
//    return (
//         <div className='bg-white mt-6'>
//             <ResponsiveContainer width="100%" height={300}>
//                 {/* Thêm margin để căn chỉnh cho biểu đồ một cột */}
//                 <BarChart data={data} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
//                     <CartesianGrid stroke="none" />

//                     {/* Bỏ XAxis nếu bạn không muốn hiển thị nhãn tháng/ngày */}
//                     {/* <XAxis dataKey="month" tick={{fontSize: 12, fill: '#555'}} stroke="none" /> */}
                    
//                     <YAxis tick={{fontSize: 12, fill: '#555'}} stroke="none" />

//                     <Tooltip content={CustomTooltip} />

//                     <Bar
//                         dataKey="amount"
//                         // Đặt màu tím cố định, tương tự màu trong ảnh
//                         fill="#5b48d6" // Màu tím đậm hơn
//                         radius={[10, 10, 0, 0]} // Giữ bo tròn góc
//                         // Loại bỏ Cell/map vì ta chỉ có một cột
//                     >
//                     </Bar>
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     )
}

export default CustomBarChart
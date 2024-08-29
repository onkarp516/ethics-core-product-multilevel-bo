import React, { useState, useEffect } from "react";

// export function RecursiveComponent(props) {
//   const [filterlist, setFilterlist] = useState([]);

//   useEffect(() => {
//     console.log("props", props);

//     setFilterlist(props.data);
//   }, []);

//   return (
//     <div style={{ paddingLeft: "20px" }}>
//       {filterlist.map((parent) => {
//         return (
//           <div key={parent.value}>
//             {/* rendering folders */}
//             {parent.isFolder && <button>{parent.label}</button>}
//             {/* rendering files */}
//             {!parent.isFolder && <span>{parent.label}</span>}
//             <div>
//               {parent.level && <RecursiveComponent data={parent.level} />}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

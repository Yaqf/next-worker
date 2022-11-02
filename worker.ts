import SparkMD5 from "spark-md5";
import {FileProps} from "./pages";

const handleFileHash = (chunkList: FileProps[]) => {
    const spark = new SparkMD5();
    return chunkList.map((item) => {
        spark.appendBinary(item.file as unknown as string);
        return {
            ...item,
            hash: spark.end()
        }
    })
}
addEventListener('message', (e) => {
    const chunkList = e.data;
    console.log(111, chunkList);
    console.log(e, '-----')
    postMessage(e.data)
})


import {Button, Container, createStyles} from '@mantine/core';
import React, {useRef} from "react";

const Styles = createStyles(() => ({
    root: {
        padding: '100px'
    },
    mul: {
        borderRadius: '50px !important',
    },
    btn: {
        display: 'flex',
        marginTop: '20px',
        height: '100px',
        flexDirection: 'row',
    }
}))

export interface FileProps {
    file: Blob
    chunkMd5?: string
}

export default function Home() {
    const {classes} = Styles();
    const workerRef = useRef<Worker>()
    const iptRef = useRef<HTMLInputElement>(null)

    // 生成文件切片
    // 对应切片生成md5 （包括文件名，内容）
    // 上传切片
    // 上传完成后合并切片
    const uploadFile = () => {
        if (!iptRef.current) return
        const file = iptRef.current.files?.[0] // 获取文件
        const chunkSize = 1024 * 1024 * 10; // 10M
        const fileSize = file?.size // 获取文件大小
        if (file === undefined || fileSize === undefined) return
        let current = 0
        while (current < fileSize) {
            workerRef.current = new Worker(new URL('../worker.ts', import.meta.url)) // 创建worker
            workerRef.current?.postMessage({file: file.slice(current, current + chunkSize)}) // 发送文件切片
            // workerRef.current!.onmessage = (event: MessageEvent<number>) => {
            //     console.log(4)
            //     alert(event.data)
            //     console.log(event.data, '---')
            // }
            workerRef.current?.terminate()
            current += chunkSize;
        }
    }

    return (
        <Container className={classes.root}>
            <input ref={iptRef} type='file'/>
            <div className={classes.btn}>
                <Button style={{marginRight: '20px'}} onClick={uploadFile}>上传</Button>
                <Button>暂停</Button>
            </div>

        </Container>
    );
}

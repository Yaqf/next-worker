import {Button, Container, createStyles} from '@mantine/core';
import React, {useEffect, useRef} from "react";

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

    // 生成文件切片
    // 对应切片生成md5 （包括文件名，内容）
    // 上传切片
    // 上传完成后合并切片
    const handleFileChunk = (file: File, fileSize: number): FileProps[] => {
        let chunkList: FileProps[] = [];
        let current = 0;
        while (current < file.size) {
            chunkList.push({file: file.slice(current, current + fileSize)})
            current += fileSize;
        }
        return chunkList;
    }


    useEffect(() => {
        workerRef.current = new Worker(new URL('../worker.ts', import.meta.url))
        workerRef.current.onmessage = (event: MessageEvent<number>) => {
            console.log(event.data, '---')
        }
        return () => {
            workerRef.current?.terminate()
        }
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const chunkSize = 1024 * 1024 * 10; // 10M
        const fileSize = file?.size
        if (file === undefined || fileSize === undefined) return
        workerRef.current?.postMessage(handleFileChunk(file, chunkSize))
    }

    return (
        <Container className={classes.root}>
            <input type='file' onChange={handleFileChange}/>
            <div className={classes.btn}>
                <Button style={{marginRight: '20px'}}>上传</Button>
                <Button>暂停</Button>
            </div>

        </Container>
    );
}

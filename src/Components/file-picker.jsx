import axios from "axios";
import classNames from "classnames";
import {nanoid} from "nanoid";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {DropZone} from "./drop-zone";
import styles from "./file-picker.module.css";
import {FilesList} from "./files-list";

const FilePicker = ({accept, uploadURL}) => {
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [uploadStarted, setUploadStarted] = useState(false);
    const [disabled, setDisabled] = useState(true);

    async function axiosDownloadFile(url, fileName) {
        try {
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'blob',
            });

            const href = window.URL.createObjectURL(response.data);

            const anchorElement = document.createElement('a');

            anchorElement.href = href;
            anchorElement.download = fileName;

            document.body.appendChild(anchorElement);
            anchorElement.click();

            document.body.removeChild(anchorElement);
            window.URL.revokeObjectURL(href);
        } catch (error) {
            console.log(error);
        }
    }


    const handleOnChange = useCallback((files) => {
        let filesArray = Array.from(files);
        filesArray = filesArray.map((file) => ({
            id: nanoid(),
            file
        }));
        setFiles(filesArray);
        setProgress(0);
        setUploadStarted(false);
    }, []);

    const handleClearFile = useCallback((id) => {
        setFiles((prev) => prev.filter((file) => file.id !== id));
    }, []);

    const canShowProgress = useMemo(() => files.length > 0, [files.length]);

    const handleUpload = useCallback(async () => {
        try {
            const data = new FormData();

            files.forEach((file) => {
                data.append("file", file.file);
            });

            const res = await axios.request({
                url: uploadURL,
                method: "POST",
                data,
                onUploadProgress: (progressEvent) => {
                    setUploadStarted(true);

                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                }
            });

            setUploadStarted(false);
            setDisabled(false);

            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }, [files.length]);

    useEffect(() => {
        if (files.length < 1) {
            setProgress(0);
        }
    }, [files.length]);

    useEffect(() => {
        if (progress === 100) {
            setUploadStarted(false);
        }
    }, [progress]);

    const uploadComplete = useMemo(() => progress === 100, [progress]);

    return (
        <div className={styles.wrapper}>

            <div className={styles.canvas_wrapper}>
                <DropZone onChange={handleOnChange} accept={accept}/>
            </div>

            {files.length ? (
                <div className={styles.files_list_wrapper}>
                    <FilesList
                        files={files}
                        onClear={handleClearFile}
                        uploadComplete={uploadComplete}
                    />
                </div>
            ) : null}

            {canShowProgress ? (
                <div className={styles.files_list_progress_wrapper}>
                    <progress value={progress} max={100} style={{width: "100%"}}/>
                </div>
            ) : null}

            {files.length ? (
                <button
                    onClick={handleUpload}
                    className={classNames(
                        styles.upload_button,
                        uploadComplete || uploadStarted ? styles.disabled : ""
                    )}
                >
                    {`Загрузить ${files.length} файл`}
                </button>
            ) : null}
            <button className="button" disabled={disabled} onClick={() => {
                const fileURL = 'http://127.0.0.1:8000/download';
                axiosDownloadFile(fileURL, 'result.xlsx');
            }}>Скачать файл
            </button>
            <h4>Пожалуйста, дождитесь пока кнопка "Скачать файл" станет активной.
            Для работы со следующим файлом
                перезагрузите страницу.</h4>
        </div>
    );
};

export {FilePicker};

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import {
  Container,
  Title,
  ImportFileContainer,
  Footer,
  ErrorComponent,
} from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [inputError, setInputError] = useState('');
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    try {
      const data = new FormData();

      data.set('file', uploadedFiles[0].file);

      await api.post('/transactions/import', data);
      history.goBack();
    } catch (err) {
      console.log(err.response);
    }
  }

  function submitFile(files: File[]): void {
    const dataFile: FileProps[] = files.map(file => ({
      file,
      name: file.name,
      readableSize: file.size.toString(),
    }));
    setUploadedFiles(dataFile);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>

            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;

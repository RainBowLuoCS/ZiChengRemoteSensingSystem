import Box from '@mui/material/Box'
import Header from '../../components/Header'
import Form from './components/Form'
import Picture from '../../pages/Home/components/Picture'
import Functions from '../../pages/Home/components/Functions'
import { useState } from 'react'
import { createStyles } from './styles'

function Create() {
  const [projectName, setProjectName] = useState('')
  const [projectId, setProjectId] = useState(0)

  return (
    <>
      <Header />
      <Box sx={createStyles.body}>
        <Form
          projectName={projectName}
          setProjectName={setProjectName}
          setProjectId={setProjectId}
        />
        <Functions name={projectName} id={projectId} />
        <Picture />
      </Box>
    </>
  )
}

export default Create

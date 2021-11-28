import { useEffect,useState } from "react";
import axios from 'axios';
import { Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import './tickets.css'
const Tickets = () => {
    const [tickets,setTickets] = useState([]);
    const [noTickets,setNoTickets] = useState(0)
    const [page,setPage] = useState(1)
    const [load,setLoad] = useState(true)
    const [ticketOpened,setTicketOpened] = useState({})
    const [modalOpened,setModalOpened] = useState(false)
    const columns = [
        { field: 'col1', headerName: 'ID', width: 300,sortable: false,filterable:false,hide:false},
        { field: 'col2', headerName: 'Subject', width: 450,sortable: false,filterable:false,hide:false },
        { field: 'col3', headerName: 'CreatedAt', width: 350,sortable: false,filterable:false,hide:false },
    ];
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      
    const getTickets = async(page) =>{
        try{
            const data = await(axios.get('http://localhost:5500/gettickets?page='+page))
            if(data){
                setNoTickets(data.data.count)
                let i =0
                const ticketData = data.data.tickets.map((item)=>{
                    i = i+1
                    return{
                        ...item,
                        id:i,
                        col1:item.id,
                        col2:item.subject,
                        col3:item.created_at
                    }
                })
                setTickets(ticketData)
                setLoad(false)
            }
        }
        catch(e){
            console.log(e)
        }
    }
    useEffect(()=>{
        getTickets(1)
    },[])
    return <div>
            <DataGrid
                disableSelectionOnClick
                rows={tickets}
                columns={columns}
                pagination
                pageSize={25}
                rowsPerPageOptions={[25]}
                rowCount={noTickets}
                paginationMode="server"
                onPageChange={(page) => {setLoad(true);setPage(page+1);getTickets(page+1)}}
                loading={load}
                onRowClick={(GridRowParams)=>{setModalOpened(true);setTicketOpened(tickets[GridRowParams.id-1])}}
            />
             <Modal open={modalOpened} onClose={()=>{setModalOpened(false)}}>
             <Box sx={style}>
                <div>
                    ID : {ticketOpened.col1}
                </div>
                <div>
                    Description : {ticketOpened.description}
                </div>
                <div>
                    Summary : {ticketOpened.subject}
                </div>
                <div>
                    Status : {ticketOpened.status}
                </div>
                <div>
                    Priority : {ticketOpened.priority}
                </div>
                <div>
                    Requester ID : {ticketOpened.requester_id}
                </div>
                <div>
                    Assignee ID : {ticketOpened.assignee_id}
                </div>
                <div>
                    Submitter ID : {ticketOpened.submitter_id}
                </div>
            </Box>
            </Modal>   
        </div>;
}
 
export default Tickets;
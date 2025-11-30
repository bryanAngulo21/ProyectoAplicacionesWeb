import Table from "../components/list/Table"

const List = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Mis Publicaciones</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8'>Este módulo te permite gestionar tus publicaciones existentes</p>
            <Table/>
        </div>
    )
}

export default List
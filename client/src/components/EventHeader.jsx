
const EventHeader =  ({question,deadline}) =>{

    return (<>
    <div className="p-4 border-b bg-white shadow-sm">
        <h1 className="text-xl font-semibold" >{question}</h1>
        <p className="text-sm text-gray-500">
            Deadline : {new Date(deadline).toLocaleString}
        </p>
    </div>
    </>)
}

export default EventHeader;


function Spinner() {
  return (
    <>
        <div className="flex flex-row gap-2 w-full h-60 items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
            <div className="w-16 h-16 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
            <div className="w-16 h-16 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
    </>
  )
}

export default Spinner
const Spinner = ({ children, loading }: any) => {
  return (
    <div className="inline-block relative">
      {children}
      {!!loading && <div className="absolute z-50 w-full h-full opacity-30 left-0 top-0">
        loading
      </div>}
    </div>
  )
}

export default Spinner

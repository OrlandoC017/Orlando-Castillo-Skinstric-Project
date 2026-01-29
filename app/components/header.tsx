import './components.css'

interface HeaderProps {
  section: string
}

export default function Header({ section }: HeaderProps) {
  return (

    <div id='header'>
        <p>SKINSTRIC</p>
        <p className='uppercase'><span className='gray'>&#123; {section} &#125;</span></p>
      
    </div>
  )
}

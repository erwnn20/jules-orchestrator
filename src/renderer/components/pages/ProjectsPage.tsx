import ProjectCard from "@components/cards/ProjectCard";
import Button from "@components/helpers/Button";
import Input from "@components/helpers/Input";
import Loader from "@components/helpers/Loader";
import BasePage from "@pages/BasePage";
import { useRepositories } from "@renderer/hooks/github/repositories.hooks";
import { Plus, SlidersHorizontal } from "lucide-react";


export default function ProjectsPage() {
  const {
    data: repositories = [],
    isLoading: isRepositoriesLoading,
    error: repositoriesError,
  } = useRepositories({ sort: 'updated', direction: 'desc' /* TODO: implement filters */ })

  return (
    <BasePage title='Projects' subtitle={`${repositories.length} repositories GitHub`}>

      <div className="flex items-center justify-end gap-3 mb-4">
        <Input disabled type={"search"} placeholder="Search projects..." className={"w-80"}/>
        <Button disabled variant={'outline'}
                className={'gap-2 bg-elevated hover:border-border-hover'}>
          <SlidersHorizontal className="w-3 h-3"/> Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[200px]">
        {repositories.map((repo, index) =>
          <ProjectCard key={index} index={index} repository={repo}/>)}

        {isRepositoriesLoading ? (<Loader/>) :
          (<button
            disabled
            className={
              "flex flex-col items-center justify-center gap-3 " +
              "bg-void border border-dashed border-border-hover rounded-lg " +
              "cursor-pointer " +
              "hover:border-primary/25 hover:bg-primary/10 " +
              "transition-colors duration-200 " +
              "disabled:opacity-50 " +
              "group"
            }>
            <div
              className={
                "flex items-center justify-center w-12 h-12 " +
                "bg-panel border border-border-hover rounded-xl " +
                "group-hover:border-primary/35 "
              }>
              <Plus className={
                "w-5 h-5 text-secondary-foreground group-hover:text-primary " +
                "transition-colors duration-200"
              }/>
            </div>
            <span className={
              "text-subtitle text-primary-foreground group-hover:text-primary " +
              "transition-colors duration-200"
            }>
            Connect Repository (WIP)
          </span>
          </button>)}
      </div>
    </BasePage>
  )
}

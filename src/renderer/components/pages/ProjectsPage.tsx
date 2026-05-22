import ProjectCard from "@components/cards/ProjectCard";
import Button from "@components/helpers/Button";
import Input from "@components/helpers/Input";
import Loader from "@components/helpers/Loader";
import BasePage from "@pages/BasePage";
import { useRepositories } from "@renderer/hooks/github/repositories.hooks";
import { twMerge } from "@renderer/utils/tw.utils";
import { Plus, SlidersHorizontal } from "lucide-react";


export default function ProjectsPage() {
  const {
    data: repositories = [],
    isLoading: isRepositoriesLoading,
    error: repositoriesError,
  } = useRepositories({ sort: 'updated', direction: 'desc' /* TODO: implement filters */ })

  const handleConnectRepository = () => {/* TODO connect new repository to jules */}

  return (
    <BasePage title='Projects' subtitle={`${repositories.length} repositories GitHub`}>

      <div className="flex items-center justify-end gap-3 mb-4">
        <Input disabled type={"search"} placeholder="Search projects..." className={"w-80"}/>
        <Button disabled variant={'outline'}
                className={'gap-2 bg-elevated hover:border-border-hover'}>
          <SlidersHorizontal className="w-3 h-3"/> Filter
        </Button>
        <Button disabled variant={"outline"}
                onClick={handleConnectRepository}
                className={twMerge(
                  'p-2 hover:pe-3',
                  'border-dashed hover:border-primary/25 hover:bg-primary/10',
                  'text-secondary-foreground hover:text-primary',
                  'transition-all duration-350',
                  'group'
                )}>
          <span className={twMerge(
            'max-w-0 overflow-hidden whitespace-nowrap duration-500',
            'group-hover:px-2 group-hover:max-w-24',
          )}>
            Connect New
          </span>
          <Plus className={'w-5 h-5'}/>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[200px]">
        {repositories.map((repo, index) =>
          <ProjectCard key={index} index={index} repository={repo}/>)}

        {isRepositoriesLoading ? (<Loader/>) :
          (<Button
            disabled
            variant={"outline"} size={"lg"}
            onClick={handleConnectRepository}
            className={twMerge(
              "flex-col gap-3",
              "hover:bg-primary/10 text-secondary-foreground  hover:text-primary",
              "border-dashed hover:border-primary/25 hover:bg-primary/10",
              "transition-colors duration-350",
              "group",
            )}>
            <div
              className={twMerge(
                "flex items-center justify-center w-12 h-12",
                "bg-panel",
                "border border-border-hover group-hover:border-primary/35 rounded-xl",
                "transition-colors duration-350",
              )}>
              <Plus className={"w-5 h-5"}/>
            </div>
            <span className={"text-subtitle"}>Connect Repository (WIP)</span>
          </Button>)}
      </div>
    </BasePage>
  )
}

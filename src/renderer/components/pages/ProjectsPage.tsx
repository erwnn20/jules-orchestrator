import ErrorCard from "@components/cards/ErrorCard";
import ProjectCard from "@components/cards/ProjectCard";
import Button from "@components/helpers/Button";
import Input from "@components/helpers/Input";
import Select from "@components/helpers/inputs/Select";
import TextInput from "@components/helpers/inputs/TextInput";
import Loader from "@components/helpers/Loader";
import { ListRepositoryRequest } from "@github/repositories/repository.interfaces";
import BasePage from "@pages/BasePage";
import { useRepositories } from "@renderer/hooks/github/repositories.hooks";
import { useSources } from "@renderer/hooks/jules/sources.hooks";
import { twMerge } from "@renderer/utils/tw.utils";
import { Check, Plus, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState } from "react";


export default function ProjectsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS)

  const { data: repositories = [], isLoading, error } = useRepositories(appliedFilters)
  const sourcesQuery = useSources()

  const filterKeys = Object.keys(DEFAULT_FILTERS) as (keyof typeof DEFAULT_FILTERS)[]
  const { activeFilterCount, hasPendingChanges } = filterKeys.reduce((acc, key) => {

    if (appliedFilters[key] !== DEFAULT_FILTERS[key]) acc.activeFilterCount++
    if (appliedFilters[key] !== draftFilters[key]) acc.hasPendingChanges = true

    return acc
  }, { activeFilterCount: 0, hasPendingChanges: false })

  const handleConnectRepository = () => {/* TODO connect new repository to jules */}

  const filtersConfig = Object.entries(FILTERS_CONFIG) as [keyof FiltersKeys, FilterConfig[keyof FilterConfig]][];

  return (
    <BasePage title='Projects'
              subtitle={`${repositories.length} repositories ${activeFilterCount === 0 ? 'GitHub' : 'affichés'}`}>

      <div className="flex items-center justify-end gap-3 mb-3">
        <Input disabled type={"search"} placeholder="Search projects..." className={"w-80"}/>
        <Button
          variant={'outline'}
          className={twMerge(
            'gap-2 bg-elevated hover:bg-border-color hover:border-border-hover',
            showFilters && ' bg-border-color border-border-hover',
          )}
          onClick={() => setShowFilters(v => !v)}
        >
          <SlidersHorizontal className="w-3 h-3"/> Filter
          {activeFilterCount > 0 && (
            <span className={twMerge(
              "flex items-baseline justify-center w-3.5 h-3.5 rounded-full",
              "bg-primary text-ghost text-label font-bold",
            )}>
              {activeFilterCount}
            </span>
          )}
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

      {showFilters && (
        <div className={twMerge(
          'flex flex-col gap-2.5 mb-4 p-3',
          'bg-panel border border-border-color rounded-lg',
        )}>
          <div className="flex items-center gap-2">
            <h4 className={'text-subtitle me-auto'}>Filters</h4>
            <Button
              variant={'ghost'}
              size={'sm'}
              className={'p-2 aspect-square text-muted hover:text-primary'}
              disabled={activeFilterCount === 0 && !hasPendingChanges}
              onClick={() => {
                setDraftFilters(DEFAULT_FILTERS)
                setAppliedFilters(DEFAULT_FILTERS)
              }}
            >
              <RotateCcw className="w-3.25 h-3.25 stroke-3"/> {/*Reset*/}
            </Button>
            <Button
              size={'sm'}
              variant={hasPendingChanges ? 'primary' : 'outline'}
              className={'p-1.75 aspect-square'}
              disabled={!hasPendingChanges}
              onClick={() => setAppliedFilters(draftFilters)}
            >
              <Check className="w-3.75 h-3.75 stroke-3"/> {/*Apply*/}
            </Button>
          </div>
          <div className={'flex items-end flex-wrap gap-3'}>

            {filtersConfig.map(([key, value], index) => {
              const draftValue = draftFilters[key]
              switch (value.type) {
                case "select":
                  return (<Select
                    size={'sm'} key={index}
                    label={(<span className={'text-meta text-secondary-foreground'}>
                      {value.label}
                    </span>)}
                    value={typeof draftValue === 'string' ? draftValue : ''}
                    className={twMerge(draftValue !== DEFAULT_FILTERS[key] && 'border-primary ')}
                    onChange={e => setDraftFilters(f => ({ ...f, [key]: e.target.value }))}
                    options={Object.entries(value.options).map(([k, label]) => ({
                      value: k, label,
                    }))}
                  />)
                case "date":
                  return (<TextInput
                    type={'date'} size={'sm'} key={index}
                    label={(<span className={'text-meta text-secondary-foreground'}>
                      {value.label}
                    </span>)}
                    className={twMerge(draftValue !== DEFAULT_FILTERS[key] && 'border-primary ')}
                    value={draftValue instanceof Date ? draftValue.toISOString().split('T')[0] : ''}
                    onChange={e => setDraftFilters(f => ({
                      ...f, [key]: new Date(e.target.value)
                    }))}
                  />)
                case "number":
                  return (<TextInput
                    type={'number'} size={'sm'} key={index}
                    label={(<span className={'text-meta text-secondary-foreground'}>
                      {value.label}
                    </span>)}
                    className={twMerge(draftValue !== DEFAULT_FILTERS[key] && 'border-primary ')}
                    value={typeof draftValue === 'number' ? draftValue : ''}
                    min={value.min} max={value.max}
                    onChange={e => setDraftFilters(f => ({
                      ...f, [key]: Number(e.target.value)
                    }))}
                  />)
              }
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[200px]">
        {repositories.map((repo, index) =>
          <ProjectCard key={index} index={index} repository={repo} sourcesQuery={sourcesQuery}/>)}

        {error && <ErrorCard error={error} style={"default"}/>}
        {isLoading ? <Loader/> :
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

type RequiredFiltersKeys = Required<ListRepositoryRequest>;
type FilterConfig = {
  [key in keyof RequiredFiltersKeys]: { label?: string; } & (
  RequiredFiltersKeys[key] extends string ? {
      type: 'select'; options: Record<RequiredFiltersKeys[key], string>
    } :
    RequiredFiltersKeys[key] extends number ? { type: 'number'; min: number; max: number } :
      RequiredFiltersKeys[key] extends Date ? { type: 'date'; } :
        never
  )
};

type FiltersKeys = Partial<Pick<RequiredFiltersKeys, 'sort' | 'direction' | 'visibility' | 'since' | 'before'>>

const FILTERS_CONFIG: Pick<FilterConfig, keyof FiltersKeys> = {
  sort: {
    label: 'Sort By',
    type: 'select',
    options: {
      created: 'Created',
      updated: 'Last updated',
      pushed: 'Last pushed',
      full_name: 'Name'
    }
  },
  direction: {
    type: 'select',
    options: {
      desc: '↓',
      asc: '↑',
    }
  },
  visibility: {
    label: 'Visibility',
    type: 'select',
    options: {
      all: 'All',
      public: 'Public',
      private: 'Private',
    }
  },
  before: { label: 'Before', type: 'date' },
  since: { label: 'After', type: 'date' },
}

const DEFAULT_FILTERS: FiltersKeys = {
  sort: 'updated',
  direction: 'desc',
  visibility: 'all',
}

import type {SiteSettings} from '@/lib/settings'
import {Breadcrumbs} from './Breadcrumbs'
import {Body} from './Body'

export function StaticPage({page, settings}: {page: any; settings: SiteSettings}) {
  return (
    <div className="container static-page">
      <Breadcrumbs items={[{name: 'Home', href: '/'}, {name: page.title, href: `/${page.slug}/`}]} />
      <h1>{page.title}</h1>
      <Body value={page.body} settings={settings} adAfterIntro={false} />
    </div>
  )
}

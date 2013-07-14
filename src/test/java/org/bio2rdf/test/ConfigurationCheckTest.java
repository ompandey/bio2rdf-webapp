/**
 * 
 */
package org.bio2rdf.test;

import java.util.Map;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openrdf.model.URI;
import org.queryall.api.base.QueryAllConfiguration;
import org.queryall.api.namespace.NamespaceEntry;
import org.queryall.utils.SettingsFactory;

/**
 * @author Peter Ansell p_ansell@yahoo.com
 * 
 */
public class ConfigurationCheckTest
{
    
    private QueryAllConfiguration settings;
    private Map<URI, NamespaceEntry> namespaces;
    
    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception
    {
        settings =
                SettingsFactory.generateSettings("/config/webapp/webapp-base-bio2rdf-release2.n3", "text/rdf+n3",
                        "http://bio2rdf.org/webapp_configuration:release2BaseConfig");
        namespaces = settings.getAllNamespaceEntries();
    }
    
    /**
     * @throws java.lang.Exception
     */
    @After
    public void tearDown() throws Exception
    {
    }
    
    @Test
    public void testNamespacesAllHaveAuthority()
    {
        for(NamespaceEntry nextNs : namespaces.values())
        {
            Assert.assertNotNull("Authority null for: " + nextNs.getKey().stringValue(), nextNs.getAuthority());
            Assert.assertFalse("Authority empty for: " + nextNs.getKey().stringValue(), nextNs.getAuthority()
                    .stringValue().isEmpty());
        }
    }
    
    @Test
    public void testNamespacesAllHaveSeparator()
    {
        for(NamespaceEntry nextNs : namespaces.values())
        {
            Assert.assertNotNull("Separator null for: " + nextNs.getKey().stringValue(), nextNs.getSeparator());
            Assert.assertFalse("Separator empty for: " + nextNs.getKey().stringValue(), nextNs.getSeparator().isEmpty());
        }
    }
    
}
